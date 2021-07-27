const { default: useForm } = require('../shared/useForm')

test('properly shortens group link based on the original value', () => {
  const { setGroupLink } = useForm()
  expect('skokawka').toEqual(
    setGroupLink('https://www.facebook.com/groups/skokawka')
  )
  expect('skokawka').toEqual(setGroupLink('facebook.com/groups/skokawka'))
  expect('skokawka').toEqual(
    setGroupLink('https://mbasic.facebook.com/groups/skokawka')
  )
  expect('skokawka').toEqual(
    setGroupLink(
      'https://www.facebook.com/groups/skokawka/?__cft__[0]=AZVYN69GTVJDrNv3MvxXPA-nmwlyT11_L4oBQfWvSGYHDvuKy83FEBFBboCxPChIKjCxvFocnazpTiftsn2FNzDBq1FNV00Gf5XFwZl5Yc7AGuGv1GWu7x96hjAyfMjgkyTr2dEc667HXixRSXNiuBBo3UZm3GVXJ6faAp3RWZz1E5SZd8DCZB0UyhGeXu8RpNs&__tn__=R]-R'
    )
  )
  expect('').toEqual(setGroupLink('a'))
})
