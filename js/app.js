Vue.component('task-column', {
    props: ['column', 'index', 'columnsLength'],
    template: `
    <div class="column">
        <h3>{{ column.title }}</h3>
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