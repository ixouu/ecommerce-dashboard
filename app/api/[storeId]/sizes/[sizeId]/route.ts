import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(
	req: Request,
	{ params }: { params: { sizeId: string } }
) {
	try {

		if (!params.sizeId) {
			return new NextResponse("Size ID is required", {
				status: 400,
			});
		}
        
		const { sizeId } = params;

		const size = await prismadb.size.findUnique({
			where: {
				id: sizeId,
			},
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZE_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; sizeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		
		const { name, value } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!value) {
			return new NextResponse("Value is required", { status: 400 });
		}

		if (!params.sizeId) {
			return new NextResponse("Size ID is required", {
				status: 400,
			});
		}

		// checck if the user is trying to update someone else's store
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { sizeId, storeId } = params;

		const size = await prismadb.size.updateMany({
			where: {
				id: sizeId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZE_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { sizeId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
        const { sizeId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.sizeId) {
			return new NextResponse("Size ID is required", {
				status: 400,
			});
		}

		// checck if the user is trying to update someone else's store
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}


		const size = await prismadb.size.deleteMany({
			where: {
				id: sizeId,
			},
		});

		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZE_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}