type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: Props) {
    const { id } = await params; 
    return <div>detail { id }</div>
}