import authSeller from "@/middleware/authSeller";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth} from "@clerk/nextjs/server"


// Get Dashboard Data for seller (total orders, total earnings, total products )
export async function GET(request){
  try{
    const { userId} = getAuth(request)
    const storeId = await authSeller(userId)

    // Get all orders for seller
    const orders = await prisma.order.findMany({where: {storeId}})

    // Get all products with ratings for seller
    const products = await prisma.product.findMany({where: {storeId}})

    const ratings = await prisma.rating.findMany({
      where: {productsId: {in: products.map(product => product.id)}},
      include: {user: true, product: true}

    })
    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: Math.round(orders.reduce((acc, order)=> acc + order.total, 0)),
      totalProducts: products.length
    }


  }catch (error){
    console.error(error);
    return NextResponse.json({error: error.code || error.message }, {status:400})
  }
}