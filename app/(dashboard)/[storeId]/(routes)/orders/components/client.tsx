"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

const BillboardClient : React.FC<OrderClientProps> = ({
  data
}) => {


  return (
    <>
      <Heading
              title={`Commandes (${data.length})`}
              description='Gérez vos commandes de votre produit'
      />
    <Separator/>
    <DataTable searchKey="prodcuts" columns={columns} data={data}/>
    </>
  )
}

export default BillboardClient