# Description of the development's rules

This short guide contains a few rules and a description of the project's codebase

## General points

- Divide large components into smaller ones
- Avoid spelling mistakes, you can use [Google Translator](https://translate.google.com/)
- For intercomponent interaction use [emits in Vue3](https://vuejs.org/guide/components/events.html#emitting-and-listening-to-events)
- if you use props don't change them in child component
- discuss this with the team before adding any library

> Not all cases can be described here
> so it is important to communicate
> with the team, discuss and decide.

## Folder structure

In general, the project uses the folder structure from [Quasar](https://quasar.dev/quasar-cli-webpack/directory-structure)

But we use custom structure in `pages/` direction:

```
pages/
  admin/
    office-managment/
          components/
          consts/
          handlers/
          types/
          OfficeManagment.vue
  user/
```

## Vue3 Code Organization

The project uses view3, there are 2 options: `traditional` and `composition API`.

The priority is the second option (composition API), so it is recommended to write all new components and code in this style. For a better understanding, you can read the documentation [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## Using state managers

We use a simple and convenient pinia state manager in our project.
You can get acquainted with a short guide how to use `Setup Store` that in [the official docs of pinia](https://pinia.vuejs.org/core-concepts/)

Generally, your store should have the following folder structure and layout based on business entities:

```
stores/
    user.ts
    clientFactory.ts
```

**Please, follow these points to separate business logic from components**:

- Try to take out data that can be associated with a business entity in the store like:

  ```
    const users = await getAllUsersFromFirestore()
  ```

- Move your functions, which can connect to server or interact with the business entity, to `your store`:

  ```
  export const useCounterStore = defineStore('counter', () => {
    const users = ref<User>([])

    // getters
    const getPieceOfUsers = computed(() => users.slice(0, 10))

    function getUsers() {
      // getting users
    }

    function deleteUser(id) {
      // delitting user
    }

    return { users, getPieceOfUsers, getUsers, deleteUser }
  })
  ```

## Error handling
When you want to show an error message in the frontend, use Alert.warning from  `src\shared\utils\Alert.utils.ts`
it handles all Firebase errors:
```
try{
	await batch.commit()
} catch (e){
	Alert.warning(e, {textColor:'red'}) // first argument can be also a string, second is options
}
```
To send an error from cloud functions to frontend:
Node.JS:  `throw  new  functions.https.HttpsError('unavailable', 'Transaction failure');`
Python: `return  jsonify({'message': 'Request does not exists'}), 404, headers`
then, pass the error from catch to Alert.warning
