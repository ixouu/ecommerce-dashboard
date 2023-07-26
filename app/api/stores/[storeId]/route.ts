import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		const { name } = body;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is required", { status: 400 });
		}

		const { storeId } = params;

		// update the store
		const store = await prismadb.store.updateMany({
			where: {
				id: storeId,
				userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log("[STORES_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// req is required event though we are not using it
// otherwise params will be undefined
export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID is required", { status: 400 });
		}

		const { storeId } = params;

		const store = await prismadb.store.deleteMany({
			where: {
				id: storeId,
				userId,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log("[STORES_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

