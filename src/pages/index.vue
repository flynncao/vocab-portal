<script setup lang="ts" generic="T extends any, O extends any">
defineOptions({
  name: 'IndexPage',
})

const name = ref('')
interface portal {
  id: number
  name: string
  link: string
  checked: boolean
  secondArgument: boolean
}
const portals = reactive<portal[]>([
  { id: 1, name: 'Cambridge Dictionary', link: 'https://dictionary.cambridge.org/dictionary/english/', checked: true, secondArgument: false },
  { id: 2, name: 'Webster Dictionary', link: 'https://www.merriam-webster.com/dictionary/', checked: false, secondArgument: false },
  { id: 3, name: 'Etymology Dictionary', link: 'https://www.etymonline.com/search?q=', checked: false, secondArgument: false },
  { id: 4, name: 'More on Youtube', link: 'https://www.youtube.com/results?search_query=', checked: false, secondArgument: true },
])
function finalUrl(keyword: string, url: string, secondArgument: boolean): string {
  return url + keyword + (secondArgument ? '+meaning' : '')
}
function go() {
  if (name.value.trim() !== '') {
    portals.forEach((item) => {
      if (item.checked) {
        const finalLink = finalUrl(name.value, item.link, item.secondArgument)
        window.open(
          finalLink,
          '_blank',
        )
      }
    })
  }
}
function toggle(index: number) {
  portals[index].checked = !portals[index].checked
}
</script>

<template>
  <div>
    <div i-carbon-assembly inline-block text-4xl />
    <p>
      <a rel="noreferrer" href="#" target="_blank">
        Xin Vocabulary
      </a>
    </p>

    <div py-4 />

    <TheInput v-model="name" placeholder="Word spell?" autocomplete="false" @keydown.enter="go" />

    <div class="p-4">
      <div v-for="(item, index) in portals" :key="index" class="mb-2">
        <input type="checkbox" :name="item.name" class="mr-1" :checked="item.checked" @change="toggle(index)">
        <label :for="item.name">{{ item.name }}</label>
      </div>
      <button class="m-3 text-sm btn" :disabled="!name" @click="go">
        Explore!
      </button>
    </div>
  </div>
</template>
