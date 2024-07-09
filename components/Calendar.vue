<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">Prev</button>
      <h2>{{ monthYear }}</h2>
      <button @click="nextMonth">Next</button>
    </div>
    <div class="calendar-body">
      <div class="day-names">
        <span v-for="day in dayNames" :key="day">{{ day }}</span>
      </div>
      <div class="days">
        <span v-for="day in blankDays" :key="day"></span>
        <span
          v-for="day in daysInMonth"
          :key="day"
          @click="selectDay(day)"
          :class="{ selected: isSelectedDay(day) }"
        >
          {{ day }}
          <div class="tasks">
            <div v-for="task in getTasksForDay(day)" :key="task.id">
              <input type="checkbox" v-model="task.completed" /> {{ task.text }}
            </div>
          </div>
        </span>
      </div>
    </div>
    <div class="task-input">
      <input v-model="newTask" placeholder="New task" />
      <button @click="addTask">Add Task</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentDate = ref(new Date());
const selectedDay = ref(null);
const newTask = ref('');
const tasks = ref([]);

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const startOfCurrentMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
});

const endOfCurrentMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);
});

const daysInMonth = computed(() => {
  const days = [];
  for (let day = 1; day <= endOfCurrentMonth.value.getDate(); day++) {
    days.push(day);
  }
  return days;
});

const blankDays = computed(() => {
  const startDay = startOfCurrentMonth.value.getDay();
  return Array(startDay).fill('');
});

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const selectDay = (day) => {
  selectedDay.value = day;
};

const isSelectedDay = (day) => {
  return selectedDay.value === day;
};

const addTask = () => {
  if (newTask.value && selectedDay.value) {
    tasks.value.push({
      id: Date.now(),
      date: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), selectedDay.value),
      text: newTask.value,
      completed: false
    });
    newTask.value = '';
  }
};

const getTasksForDay = (day) => {
  const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return tasks.value.filter(task => task.date.toDateString() === date.toDateString());
};
</script>

<style scoped>
.calendar {
  width: 300px;
  margin: auto;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.day-names, .days {
  display: contents;
}
.day-names span, .days span {
  text-align: center;
  cursor: pointer;
}
.days span.selected {
  background-color: lightblue;
}
.tasks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.task-input {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
