<script setup lang="ts">
import { motion } from 'motion-v'
</script>

<template>
    <motion.div
      ref={domRef}
      id={props.planRowId}
      :class="['y-center absolute transition-[colors,opacity] px-xs ws-nowrap text-15', {
        'rounded-l-xs border-l-5 border-accent': includingStart,
        'rounded-r-xs': includingEnd,
        'pointer-events-none': planState.hasEditingPlan,
      }]"
      :initial="initial"
      :animate="animate"
      :exit="exit"
      :style="style"
      :transition="{ duration: 0.15 }"
      @MouseEnter="handleMouseEnter"
      @MouseLeave="handleMouseLeave"
      @MouseDown="handlePlanMouseDown"
      @ContextMenu="handlePlanContext"
      @LayoutAnimationStart="handleLayoutAnimationStart"
      @LayoutAnimationComplete="handleLayoutAnimationComplete"
    >
      <div
        v-if="includingStart"
        className="absolute left--15 top--25% h-150% w-35 cursor-ew-resize"
        @MouseDown="handlePlanStartMouseDown"
      />
      <span>{{ workingDays }}d ({{workingHours}}h)</span>
      <span v-if="planState.plan.description" className="truncate">: {{ planState.plan.description }}</span>

      <div
        v-if="includingEnd"
        className="absolute right--15 top--25% h-150% w-35 cursor-ew-resize"
        @MouseDown="handlePlanEndMouseDown"
      />
    </motion.div>
</template>
