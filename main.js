Vue.component('todo-list', {
    template: `
    <div>
    <div class="header">   
    <h1 class="title">Todo List App</h1>
    </div>
    <input type="text" class="todo-input" placeholder="what needs to be done" v-model="newTodo" @keyup.enter="addTodo">
  <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown"> 
    <div class="todo-item" v-for="(todo, index) in todosFiltered" :key="todo.id">
        <div class="todo-item-left">
            <input type="checkbox" v-model="todo.completed" @change="checkTodos(todo)">
            <div class="todo-item-label" :class="{completed : todo.completed}" v-if="!todo.editing" @dblclick="editTodo(todo)">{{ todo.title }} </div>
            <input class="todo-item-edit" v-else type="text" v-model="todo.title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" v-focus>
        </div>
        <div class="remove-item" @click="removeTodo(index)">
            &times;
        </div>
    </div>
  </transition-group>

    <div class="extra-container">
        <div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAllTodos">Check All</label></div>
        <div>{{ remaining }} items left</div>
        
    </div>
    <div class="extra-container">
        <div>
            <button :class="{ active: filter == 'All'}" @click="filter = 'All'">All</button>
            <button :class="{ active: filter == 'Active'}" @click="filter = 'Active'">Active</button>
            <button class="btn" :class="{ active: filter == 'Completed'}" @click="filter = 'Completed'">Completed</button>
        </div>
        <div>
            <transition name="fade">
              <button class="clear" v-if="showClearButton" @click="clearCompleted">clear completed</button> 
            </transition>
        </div>
    </div>
</div>
    `,

    data () {
        return {
          newTodo: '',
          idForTodo: 1,
          beforeEditCache: '',
          filter:'All',
          todos: [],
        }
      },
    
      mounted(){
          if(localStorage.getItem('todos')){
              try{
                  this.todos = JSON.parse(localStorage.getItem('todos'));
              } catch(e){
                  localStorage.removeItem('todos');
              }
          }
    },
    
      computed:{
          remaining(){
              return this.todos.filter(todo => !todo.completed).length
          },
    
          anyRemaining(){
              return this.remaining != 0
          },
    
          todosFiltered(){
              if (this.filter == 'All') {
                  return this.todos
              } else if (this.filter == 'Active') {
                  return this.todos.filter(todo => !todo.completed)
              } else if (this.filter == 'Completed') {
                  return this.todos.filter(todo => todo.completed)
              } 
                  
                  return this.todos
                
              },
    
          showClearButton(){
              return this.todos.filter(todo => todo.completed).length > 0
          },  
      },
    
          
    
      directives: {
          focus:{
              inserted: function(el){
                  el.focus()
              }
          }
      },
    
      methods:{
          addTodo(){
              if(this.newTodo.trim().length == 0){
                  return
              }
    
              this.todos.push({
                  id: this.idForTodo,
                  title: this.newTodo,
                  completed: false,
                  editing: false,
              })
    
              this.newTodo = ''
              this.idForTodo++
              this.saveTodos();
          },
    
          removeTodo(index){
              this.todos.splice(index, 1)
              this.saveTodos();
          },
    
          editTodo(todo){
              this.beforeEditCache = todo.title
              todo.editing = true          
          },
    
          cancelEdit(todo){
              todo.title = this.beforeEditCache
              todo.editing = false
          },
    
          doneEdit(todo){
              if(todo.title.trim() == ''){
                  todo.title = this.beforeEditCache
              }
    
              todo.editing = false
              this.saveTodos();
          },
    
          checkTodos(todo){
              if(todo.completed){
                 todo.completed = true 
              } else if (!todo.completed){
                 todo.completed = false 
              }
              
              this.saveTodos();
        },

          checkAllTodos(){
              this.todos.forEach((todo) => todo.completed = event.target.checked)
              this.saveTodos();
          },
    
          clearCompleted(){
              this.todos = this.todos.filter(todo => !todo.completed)
              this.saveTodos();
          },
    
          saveTodos(){
              const parsed = JSON.stringify(this.todos);
              localStorage.setItem('todos', parsed);
          }
      }
}),

new Vue({
    el: '#app',
    
  });
  