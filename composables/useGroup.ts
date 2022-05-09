import { getApp } from '@firebase/app'
import { getDatabase, ref, set } from '@firebase/database'
import { useSectionsStore } from '~~/store/useSections'
import { useTaggroupsStore } from '~~/store/useTaggroups'
import type { Groups } from '~~/types/Groups'

export function useGroup() {
  function getApproximateMembersCount(members: number | undefined) {
    const memberRanges: [number, number, string][] = [
      [0, 100, '0+'],
      [101, 500, '100+'],
      [501, 1000, '500+'],
      [1001, 2500, '1K+'],
      [2501, 5000, '2.5K+'],
      [5001, 10000, '5K+'],
      [10001, 25000, '10K+'],
      [25001, 50000, '25K+'],
      [50001, 75000, '50K+'],
      [75001, 100000, '75K+'],
      [100001, 150000, '100K+'],
      [150001, 200000, '150K+'],
      [200001, Infinity, '250K+'],
    ]

    if (!members)
      return null

    return memberRanges.find(x => members >= x[0] && members <= x[1])![2]
  }

  function deleteGroup(name: 'sections' | 'taggroups', link: string) {
    const runtimeConfig = useRuntimeConfig()
    const newGroups = (name === 'sections' ? useSectionsStore().groups : useTaggroupsStore().groups).filter(x => x.link !== link)
    const groups: Groups = {
      name,
      lastUpdateDate: new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
      groups: newGroups,
    }
    set(ref(getDatabase(getApp()), `${name === 'sections' ? runtimeConfig.public.sectionsPath : runtimeConfig.public.taggroupsPath}`), groups)
  }

  function stripLink(link: string) {
    return new URL(link).pathname.split('/')[2]
  }

  return {
    getApproximateMembersCount,
    deleteGroup,
    stripLink,
  }
}
