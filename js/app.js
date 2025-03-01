Vue.component('task-card', {
    props: ['task', 'colIndex', 'columnsLength'],
    template: `
    <div class="task">
        <p>{{ task.title }}</p>
        <p>{{ task.description }}</p>
        <p>Дэдлайн: {{ task.deadline }}</p>
        <p>Создано: {{ task.createdAt }}</p>
        <p>Последнее изменение: {{ task.lastEdited }}</p>
        <button @click="$emit('delete-task', task, colIndex)">Удалить</button>
        <button v-if="colIndex < columnsLength - 1" @click="$emit('move-task', task, colIndex, colIndex + 1)">Далее</button>
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
                @delete-task="$emit('delete-task', $event, index)"
                @move-task="$emit('move-task', $event, $event1, $event2)"
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
            ],
            newTask: { title: '', description: '', deadline: '' }
        };
    },
    methods: {
        saveToLocalStorage() {
            localStorage.setItem('kanbanColumns', JSON.stringify(this.columns));
        },
        addTask() {
            if (!this.newTask.title || !this.newTask.description || !this.newTask.deadline) return;
            this.columns[0].tasks.push({
                ...this.newTask,
                createdAt: new Date().toLocaleString(),
                lastEdited: new Date().toLocaleString()
            });
            this.newTask = { title: '', description: '', deadline: '' };
            this.saveToLocalStorage();
        },
        deleteTask(task, colIndex) {
            this.columns[colIndex].tasks = this.columns[colIndex].tasks.filter(t => t !== task);
            this.saveToLocalStorage();
        },
        moveTask(task, fromColumn, toColumn) {
            if (toColumn >= this.columns.length) return;
            this.columns[fromColumn].tasks = this.columns[fromColumn].tasks.filter(t => t !== task);
            this.columns[toColumn].tasks.push(task);
            task.lastEdited = new Date().toLocaleString();
            this.saveToLocalStorage();
        }
    },
    template: `
    <div id="app">
        <div class="task-form">
            <input v-model="newTask.title" placeholder="Название">
            <input v-model="newTask.description" placeholder="Описание">
            <input type="date" v-model="newTask.deadline">
            <button @click="addTask">Добавить задачу</button>
        </div>
        <div class="columns">
            <task-column
                v-for="(column, index) in columns"
                :key="index"
                :column="column"
                :index="index"
                :columnsLength="columns.length"
                @delete-task="deleteTask"
                @move-task="moveTask"
            ></task-column>
        </div>
    </div>
    `
});