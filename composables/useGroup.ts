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

    return memberRanges.find(x => members >= x[0] && members <= x[1])[2]
  }

  return {
    getApproximateMembersCount,
  }
}
