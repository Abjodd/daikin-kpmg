import PageLayout from '../../layouts/PageLayout.jsx'
import GenericPage from '../GenericPage.jsx'

export default function GoodsMovement() {
  return (
    <PageLayout>
      <GenericPage
        title="Goods Movement"
        description="Track all goods movements assigned to your supplier account."
        icon="📊"
      />
    </PageLayout>
  )
}
