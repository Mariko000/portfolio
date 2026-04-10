<template>
    <div>
      <h1>カレンダー</h1>

      <!--7列×必要な行（5〜6行）でグリッド構造を作る-->

    <div class="calendar">

      <div class="button-area">
      <button @click="prevMonth">前月</button>
      <button @click="nextMonth">翌月</button>
      </div>
       <!-- 月のセル -->
      <div class="calendar-head-top">
        <div class="month-header">
          {{ currentMonthLabel }}
        </div>
      </div>

      <!-- 曜日のセル -->
      <div class="calendar-head-row">
        <div v-for="day in weekDays" :key="day" class="week-header">
          {{ day }}

        </div>
      </div>

        <!-- カレンダー本体 -->
        <div class="calendar-grid">
           <!-- カレンダーのセル -->
            <div
            v-for="(cell, index) in calenderCells"
            :key="index"
            :class="['date-cell',cell ? cell.holidayType : 'empty-cell',
            cell && cell.isToday ? 'today' : ''
            ]">
            {{ cell ? cell.day : '' }}
           </div>
           </div>
   

    </div>
  </div>
    
 
  <p>ScheduleCalendar.vue</p>
  </template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import JapaneseHolidays from 'japanese-holidays'

// dayjsの祝日判定のため
dayjs.locale('ja');

//今表示中の年月を保持
const currentDate = ref(dayjs())
const today = dayjs(); // 今日の日付を保持

//月の最初の日・最後の日・曜日を取得
const startOfMonth = computed(() => currentDate.value.startOf('month'))
const endOfMonth = computed(() => currentDate.value.endOf('month'))
const daysInMonth = computed(() => currentDate.value.daysInMonth())
const startDayOfWeek = computed(() => currentDate.value.day())


// カレンダーのセルを求める
const firstDayIndex = computed(() => startOfMonth.value.day());

// 曜日ヘッダ-
const weekDays = ['日', '月', '火', '水', '木', '金', '土']

//現在表示中の年月
const currentMonthLabel = computed(() => currentDate.value.format('YYYY年 M月'))


// カレンダーのセルを生成するComputedプロパティ
const calenderCells = computed(() => {
  const cells = []

  // 空のセル
  for (let i = 0; i < firstDayIndex.value; i++) {
    cells.push(null)
  }

  // 日付のセル
  for (let i = 1; i <= daysInMonth.value; i++) {
    const date = currentDate.value.date(i)
    cells.push({
      day: i,
      dateStr: date.format('YYYY-MM-DD'),
      holidayType: getHolidayType(date.format('YYYY-MM-DD')),
      isToday:date.isSame(today,'day'),
    })
  }

  return cells
})


//「前月」「翌月」ボタンを押したときに currentDate を操作する
const prevMonth = () => {
  currentDate.value = currentDate.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, 'month')
}


// 土日判定のロジック
const getHolidayType = (dateStr) =>{
  const date = dayjs(dateStr)
  if(JapaneseHolidays.isHoliday(date.toDate())){
    return 'national-holiday'
  }
  const day = date.day()
  if(day === 0) return 'sunday'
  if(day === 6) return 'saturday'
  return ''
}


</script>

<style>
.calendar{
  max-height: 100%;
  margin: 5%;

}
.button-area{
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.button-area button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: #4caf50;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.button-area button:hover {
  background: #43a047;
}

.calendar-head-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}

.week-header {
  background: rgb(39, 128, 216);
  color: aliceblue;
  text-align: center;
  padding: 8px;
  font-weight: bold;
  white-space: nowrap;
  border: 1px solid rgb(167, 166, 166, 75);
}

.empty-cell {
  height: 40px;

  border: 1px solid rgb(167, 166, 166, 55);
}

.date-cell {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(167, 166, 166,55);
}
.date-cell:hover {
  background: #fbbbf7;
  transform: scale(1.05);
}

.date-cell.today {
  background: #ffeb3b;
  color: #333;
  font-weight: 700;
  box-shadow: 0 0 0 3px #fbc02d inset;
}

.date-cell.sunday {
  background-color: #ffcdd2;
  color: #c62828;
}
.date-cell.saturday {
  background-color: #bbdefb;
  color: #1565c0;
}
.date-cell.national-holiday {
  background-color: #ffe0b2;
  color: #ef6c00;
}

</style>