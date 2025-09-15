import dynamic from 'next/dynamic'

const DynamicPageContent = dynamic(() => import('./_components/PageContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const Page = () => {
  return <DynamicPageContent />
}

export default Page