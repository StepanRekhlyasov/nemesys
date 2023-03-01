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