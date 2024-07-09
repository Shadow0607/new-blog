<template>
  <div>
    <h1>GitHub 更新紀錄</h1>
    <div v-for="(commits, repo) in repoCommits" :key="repo" class="mb-8">
      <h2>{{ repo }}</h2>
      <UAccordion :items="commits" :ui="{ wrapper: 'flex flex-col w-full' }">
        <template #default="{ item, index, open }">
          <div>
            <UButton as="button" color="gray" variant="ghost" class="border-b border-gray-200 dark:border-gray-700"
              :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }">
              <span class="truncate">{{ index + 1 }}. {{ new Date(item.commit.committer.date).toLocaleString() }}</span>

              <template #trailing>
                <UIcon name="i-heroicons-chevron-right-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200" :class="[open && 'rotate-90']" />
              </template>

            </UButton>

            <!-- 折叠内容 -->
            <div v-if="open" class="p-3">
              <p>{{ item.commit.message }}</p>
            </div>
          </div>
        </template>
      </UAccordion>
    </div>
  </div>
  <div>
    <Calendar/>
  </div>
</template>

<script setup>
import { useFetch } from '#app'
import { useRuntimeConfig, useState } from '#app'
import Calendar from '~/components/Calendar.vue'
// 获取环境变量
const config = useRuntimeConfig()

// 定义响应式状态
const repoCommits = useState('repoCommits', () => ({}))

// 定义包含多个仓库提交记录 URL 的数组
const urls = {
  'new-blog': 'https://api.github.com/repos/Shadow0607/new-blog/commits',
  'LeetCode': 'https://api.github.com/repos/Shadow0607/LeetCode/commits'
  // 可以添加更多的仓库 URL
}

// 使用 Promise.all 并行获取多个仓库的提交记录
const fetchCommits = async () => {
  const fetches = Object.entries(urls).map(async ([repo, url]) => {
    const res = await useFetch(url)
    return [repo, res.data.value]
  })

  const results = await Promise.all(fetches)
  results.forEach(([repo, commits]) => {
    repoCommits.value[repo] = commits
  })
}

// 调用获取提交记录的函数
await fetchCommits()
</script>
