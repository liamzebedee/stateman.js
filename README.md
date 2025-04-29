stateman.js
===========

A tiny (60 LOC), simple, state management library for React.

## Install.

```sh
npm i @liamzebedee/stateman.js
```

## What is stateman?

Stateman is basically the ViewController pattern for React. It's extremely simple and straightforward. You define a class that has state and methods (mutations like addTodo, getters like getTodo, async too).

Unlike other state management solutions, stateman is basically plain JS. There are no new patterns to learn, there's no special syntax, there's no boilerplate. Stateman looks like regular JS, and it's only 60 lines of code with no external libraries.

It's really easy to define controllers, and then use their state in different places. There's no `Context`, there's no deep copying or performance overhead.

Let me show you:

Define **controllers**. Controllers are just regular JS classes with a `state` that can be modified in-place.

```ts
interface TodosState {
    todos: string[]
}

export class TodoListController extends Model<TodosState> {
    constructor() {
        super({ todos: [] });
    }

    getTodos(): string[] {
        return this.state.todos;
    }

    addTodo(text: string): void {
        this.state.todos.push(text);
    }

    editTodo(index: number, text: string): void {
        this.state.todos[index] = text;
    }
}
```

Use controllers in your views with `useController`:

```tsx
export default function Home() {
  const todoController = useController(new TodoListController());
  // ...
}
```

Call methods on the controllers to update state:

```tsx
return <div>
    <button onClick={() => todosController.addTodo("test")}/>
    <button onClick={() => todosController.editTodo(0, "test-edited")}/>
</div>
```

Render the state from a controller:

```tsx
return <div>
    {todoController.state.todos.map((todo, i) => {
        return <div key={i}>{todo}</div>
    })}
</div>
```

Stateman controllers can be global singletons, meaning you can use their state in different places. That's pretty simple:

```tsx
const userController$ = new UserController()

const Login = () => {
    const userController = useController(userController$)
    return <div>
        <button onClick={userController.login()}/>
    </div>
}

const LoggedInView = () => {
    const userController = useController(userController$)
    return userController.state.getSession().username
}
```

They can also just be instantiated, meaning you can use the same controller logic for many instances of a component, e.g.:

```tsx
const ReplyToComment = ({ commentId }: { commentId: number }) => {
    const postCommentController = useController(new PostCommentController(commentId))
    // ...
}

const Article = () => {
    const comments = ['a', 'b', 'c']
    return <div>
        {comments.map((comment, i) => {
            return <li key={i}>
                <span>{comment}</span>
                <ReplyToComment commentId={i}/>
            </li>
        })}
    </div>
}
```
