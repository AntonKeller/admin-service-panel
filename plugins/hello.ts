export default defineNuxtPlugin(async () => {

    const user = useState('user')

    user.value = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => json?.title);

    // user.value = false;
});