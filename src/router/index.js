import { createRouter, createWebHashHistory } from 'vue-router'

// 各viewのインポート
import WorksList from '@/views/WorksList.vue'
import template from '@/views/template_edit.vue'
import ToolsList from '@/views/ToolsList.vue'

// プロジェクト管理
// import DashboardView from '@/views/tools/Taskmanager/DashboardView.vue'
// import ProjectArchive from '@/views/tools/Taskmanager/HistoryProjectArchive.vue'
import ProgressProject from '@/views/tools/Taskmanager/ProgressProject.vue'
// import CodeCheatSheet from '@/views/tools/Taskmanager/CodeCheatSheet.vue'

// プロジェクト生成ツール
import CreateNewProject from '@/views/CreateNewProject.vue'
import FeatureList from '@/views/tools/Taskmanager/FeatureList.vue'
import NewProjectHome from '@/views/tools/Taskmanager/NewProjectHome.vue'
import TaskScheduleSetting from '@/views/tools/Taskmanager/TaskScheduleSetting.vue'
// import FinalAdjustConfirm from '@/views/tools/Taskmanager/FinalAdjustConfirm.vue'
// import PageStructure from '@/views/tools/Taskmanager/PageStructureEditor.vue'
import EstimatedConstruction from '@/views/tools/Taskmanager/EstimatedConstructionView.vue'


//プロジェクト詳細ページ
import ProjectDetail from '@/views/tools/Taskmanager/ProjectDetailsPage.vue'
// import PageStructureChild from '@/views/tools/Taskmanager/PageTree.vue'




// タスクマネージャー
import TaskManagerView from '@/views/tools/Taskmanager/TaskManagerView.vue'
// import ChatBot from '@/views/tools/Taskmanager/ChatBotDialog.vue'
// import CodeLabView from '@/views/tools/Taskmanager/CodeLabView.vue'
// import HtmlCheatSheet from '@/views/tools/Taskmanager/HtmlCheatSheet.vue'
// import CssCheatSheet from '@/views/tools/Taskmanager/CssCheatSheet.vue'
// import JSCheatSheet from '@/views/tools/Taskmanager/JSCheatSheet.vue'



//スケジュール系
// import ScheduleView from '@/views/tools/Taskmanager/ScheduleView.vue'
import ScheduleCalendar from '@/views/tools/Taskmanager/ScheduleCalendar.vue'



// ChatTool関連
import ChatDashboard from '../views/tools/ChatTool/ChatDashboard.vue'
import ChatRoom from '../views/tools/ChatTool/ChatRoom.vue'

// CustomerManagement関連
import CustomerDashboard from '../views/tools/CustomerManagement/CustomerDashboard.vue'
import CustomerList from '../views/tools/CustomerManagement/CustomerList.vue'

// SimpleBuilder関連
import SimpleBuilderDashboard from '../views/tools/SimpleBuilder/SimpleBuilderDashboard.vue'

// ゲーム
import ClickGame from '@/views/games/ClickGame.vue'
import TypingGame from '@/views/games/TypingGame.vue'
import QuizGame from '@/views/games/QuizGame.vue'
import MemoryGame from '@/views/games/MemoryGame.vue'



const routes = [
  { path: '/WorksList', name: 'WorksList', component: WorksList },
  { path: '/template', name: 'template', component: template },
  { path: '/tools', name: 'ToolsList', component: ToolsList },
  { path: '/games/click', name: 'ClickGame', component: ClickGame },

   // DashboardView を単独ルートで
  //{ path: '/tools/dashboard', component: DashboardView },

  // TaskManagerView を単独ルートで
  { path: '/', name: 'TaskManager', component: TaskManagerView },
  // { path: '/tools/task-manager/chat-bot-dialog', component: ChatBot },


  // プロジェクト管理系ルート
  { path: '/tools/task-manager/create-new-project', component: CreateNewProject },
  { path: '/tools/task-manager/feature-list', component:FeatureList },
  { path: '/tools/task-manager/create-new-home', component: NewProjectHome },
  // { path: '/tools/task-manager/project-archive', component: ProjectArchive },
  { path: '/tools/task-manager/project-detail-page', component: ProjectDetail },
  // { path: '/tools/task-manager/code-lab', component: CodeLabView },
  { path: '/tools/task-manager/tasks-schedule-setting', component: TaskScheduleSetting },
  // { path: '/tools/task-manager/final-adjust-confirm', component: FinalAdjustConfirm },
  // { path: '/tools/task-manager/page-structure', component: PageStructure },
  { path: '/tools/task-manager/Estimated-Construction', component: EstimatedConstruction },
  // { path: '/tools/task-manager/PageTree.vue', component: PageStructureChild },





 //カレンダー
 { path: '/tools/task-manager/schedule-calendar.vue', component: ScheduleCalendar },
 

  //テンプレート系
  // { path: '/tools/task-manager/code-cheat-sheet', component: CodeCheatSheet },
  // { path: '/tools/task-manager/html-cheatsheet', component: HtmlCheatSheet },
  // { path: '/tools/task-manager/css-cheatsheet', component: CssCheatSheet },
  // { path: '/tools/task-manager/js-cheatsheet', component: JSCheatSheet },
  { path: '/tools/task-manager/progress-project', component: ProgressProject },
  // { path: '/tools/task-manager/schedule', component: ScheduleView },
  { path: '/tools/task-manager/project-detail', component: ProjectDetail },



// ChatTool
{ path: '/tools/ChatTool', component: ChatDashboard },
{ path: '/tools/ChatTool/room', component: ChatRoom },

// CustomerManagement
{ path: '/tools/CustomerManagement', component: CustomerDashboard },
{ path: '/tools/CustomerManagement/list', component: CustomerList },

// SimpleBuilder
{ path: '/tools/SimpleBuilder', component: SimpleBuilderDashboard },

// ゲーム

{ path: '/games/click-game', component: ClickGame },
{ path: '/games/typing-game', component: TypingGame },
{ path: '/games/quiz-game', component: QuizGame },
{ path: '/games/memory-game', component: MemoryGame }
]


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})



export default router
