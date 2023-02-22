import { StorageSerializers, useLocalStorage, RemovableRef } from '@vueuse/core'
import { addDays, addWeeks, differenceInCalendarDays, eachDayOfInterval, endOfWeek, isSameDay, isToday, isWeekend, isWithinInterval, max, min, previousSunday, startOfDay, startOfWeek } from 'date-fns'
import { ref, reactive, computed, ComputedRef } from 'vue'
import { isChineseWorkingDay, isChineseHoliday, findChineseDay } from './chinese-holidays'

export interface Day {
  date: number
  id: number
  work: boolean
  peace: boolean
  current: boolean
  today: boolean
  selected: boolean
  tip: string
}

export interface Plan {
  id: number
  start: number
  end: number
  entry: number
  workDays: number
  workHours: number
  offDays: number
  lane: number
  note?: string
  color: string
}

export interface Mark {
  date: number
  note?: string
}

export const weeks = [
  { name: '周一', peace: false },
  { name: '周二', peace: false },
  { name: '周三', peace: false},
  { name: '周四', peace: false },
  { name: '周五', peace: false },
  { name: '周六', peace: true },
  { name: '周日', peace: true },
]

class DayManager {
  days: Day[] = []
  static getNearbyDays(current: Date | number, prev: number, next: number): Day[] {
    const days = eachDayOfInterval({
      start: addDays(current, -prev),
      end: addDays(current, next),
    }).map(day => getDay(day.valueOf()))
    return days
  }
  constructor(options?: { current?: Date | number; prev?: number; next?: number }) {
    const current = options?.current || Date.now()
    const prev = options?.prev || differenceInCalendarDays(
      current,
      startOfWeek(current, { weekStartsOn: 1 }),
    )
    const next = options?.next || differenceInCalendarDays(
      endOfWeek(addWeeks(current, 10), { weekStartsOn: 1 }),
      current,
    )
    this.days = DayManager.getNearbyDays(current, prev, next)
  }
  addPrevDays(prev = 28) {
    const firstDay = this.days[0].date
    const prevDays = DayManager.getNearbyDays(firstDay, prev, -1)
    this.days.unshift(...prevDays)
  }
  addNextDays(next = 28) {
    const lastDay = this.days[this.days.length - 1].date
    const nextDays = DayManager.getNearbyDays(lastDay, -1, next)
    this.days.push(...nextDays)
  }
}

class Planner {
  colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#059669', '#d97706', '#0f766e', '#15803d']
  plans: RemovableRef<Plan[]>
  constructor(plans: RemovableRef<Plan[]>) {
    this.plans = plans
  }
  add(start: number, end: number, entry: number = start) {
    const id = Date.now()
    const basePlan = this.getBasePlan(start, end)
    const color = this.getColor()
    const plan = { ...basePlan, id, entry, color, lane: 0, }
    this.plans.value.push(plan)
    this.schedule()
    return id
  }
  update(planId: number, plan: {start: number; end: number;}) {
    const oldPlan = this.plans.value.find(p => p.id === planId)
    const basePlan = this.getBasePlan(plan.start, plan.end)
    // @ts-ignore
    Object.keys(basePlan).forEach(k => oldPlan[k] = basePlan[k])
    this.schedule()
  }
  getBasePlan(start: number, end: number) {
    const days = eachDayOfInterval({ start, end })
    const workDays = days.filter(day => isWorkDay(day)).length
    const workHours = workDays * hours.value
    const offDays =  days.length - workDays
    return { start, end, workDays, workHours, offDays }
  }
  getColor() {
    // return this.plans.value.length <= this.colors.length
    //  ? this.colors[this.plans.value.length % this.colors.length]
    //  : '#' + Math.floor(Math.random()*16777215).toString(16)
    return '#3b82f6'
  }
  delete(planId: number) {
    this.plans.value = this.plans.value.filter(plan => plan.id !== planId)
    this.schedule()
  }
  get(planId: number | null) {
    return this.plans.value.find(plan => plan.id === planId)
  }
  schedule() {
    this.plans.value.forEach((plan, idx) => {
      const days = eachDayOfInterval({ start: plan.start, end: plan.end})
      const prevPlans = this.plans.value.slice(0, idx)
      const dayLaneStack: boolean[] = []
      days.forEach(day => {
        const currentDayPlans = prevPlans.filter(plan => isWithinInterval(day, { start: plan.start, end: plan.end }))
        currentDayPlans.forEach(plan => dayLaneStack[plan.lane] = true)
      })
      const avaliableLane = dayLaneStack.findIndex(lane => !lane)
      plan.lane = avaliableLane === -1 ? dayLaneStack.length : avaliableLane
    })
  }
  calculateWorkHours() {
    this.plans.value.forEach(plan => plan.workHours = plan.workDays * hours.value)
  }
}

export const current = ref(startOfDay(Date.now()).valueOf())
export const hours = useLocalStorage('hours', 8)
export const marks = useLocalStorage<Map<number, Mark>>('marks', new Map())
export const editingPlanId = ref(null as number | null)
export const highlightPlanId = ref(null as number | null)
export const activePlanId = computed(() => editingPlanId.value || highlightPlanId.value)
export const plans = useLocalStorage('plans/v2', [])
export const planner = new Planner(plans)
export const daysRef = reactive({
  dayManager: new DayManager()
})

watch(hours, () => planner.calculateWorkHours())
watch(editingPlanId, (newEditingPlanId, oldEditingPlanId) => {
  if(!newEditingPlanId) {
    const oldEditingPlan = planner.get(oldEditingPlanId)
    oldEditingPlan && (oldEditingPlan.entry = oldEditingPlan.start)
  }
})

export function toggleMark(day: number) {
  if(marks.value.has(day)) {
    marks.value.delete(day)
  } else {
    marks.value.set(day, { date: day })
  }
}

export function focusDay(day: number) {
  const targetId = getDay(day).id
  const targetDayNode = document.getElementById(String(targetId))
  targetDayNode?.scrollIntoView()
}

export function focusToday() {
  focusDay(current.value)
}

export function getDay(day: number): Day {
  const chineseDay = findChineseDay(day)
  const tip = chineseDay ? chineseDay.type === 'holiday' 
    ? chineseDay.name
    : chineseDay.type === 'workingday'
    ? `补班`
    : '' : ''
  return {
    id: day,
    date: day,
    current: isSameDay(day, current.value),
    today: isToday(day),
    work: isWorkDay(day),
    peace: isOffDay(day),
    selected: false,
    tip
  }
}

export function isWorkDay(day: number | Date): boolean {
  return isWeekend(day) ? isChineseWorkingDay(day)
  : !isChineseHoliday(day)
}

export function isOffDay(day: number | Date): boolean {
  return isWeekend(day) ? !isChineseWorkingDay(day)
    : isChineseHoliday(day)
}
