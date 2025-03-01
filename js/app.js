Vue.component('task-card', {
    props: ['task', 'colIndex', 'columnsLength'],
    template: `
    <div class="task">
        <p>{{ task.title }}</p>
        <p>{{ task.description }}</p>
        <p>Дэдлайн: {{ task.deadline }}</p>
    </div>
    `
});

Vue.component('task-column', {
    props: ['column', 'index', 'columnsLength'],
    template: `
    <div class="column">
        <h3>{{ column.title }}</h3>
        <div class="tasks">
            <task-card
                v-for="(task, taskIndex) in column.tasks"
                :key="taskIndex"
                :task="task"
                :colIndex="index"
                :columnsLength="columnsLength"
            ></task-card>
        </div>
    </div>
    `
});

new Vue({
    el: '#app',
    data() {
        return {
            columns: JSON.parse(localStorage.getItem('kanbanColumns')) || [
                { title: 'Запланированные задачи', tasks: [] },
                { title: 'В работе', tasks: [] },
                { title: 'Тестирование', tasks: [] },
                { title: 'Выполненные задачи', tasks: [] }
            ]
        };
    },
    methods: {
        saveToLocalStorage() {
            localStorage.setItem('kanbanColumns', JSON.stringify(this.columns));
        }
    },
    template: `
    <div id="app">
        <div class="columns">
            <task-column
                v-for="(column, index) in columns"
                :key="index"
                :column="column"
                :index="index"
                :columnsLength="columns.length"
            ></task-column>
        </div>
    </div>
    `
});