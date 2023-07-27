"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import  ApiList  from "@/components/ui/api-list";

interface BillBoardClientProps {
  data: BillboardColumn[];
}

const BillboardClient : React.FC<BillBoardClientProps> = ({
  data
}) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
                title={`Bannières (${data.length})`}
                description='Gérez vos bannières pour vos magasins'
        />
        <Button
            onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Ajouter une bannière
        </Button>
    </div>
    <Separator/>
    <DataTable 
      columns={columns}
      data={data}
      searchKey="label"
    />
    <Heading title="API" description="API pour les bannières" />
    <Separator />
    <ApiList 
      entityName="billboards"
      entityIdName="billboardId"
    />
    </>
  )
}

export default BillboardClient