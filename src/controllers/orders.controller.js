import * as OrdersService from "../services/orders.service.js";
import { successResponse } from "../utils/response.js";

export async function create(req, res, next) {
  try {
    const buyerId = req.user.uid;
    const order = await OrdersService.createOrder({ ...req.body, buyerId });
    return successResponse(res, order, {}, 201);
  } catch (error) {
    next(error);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const buyerId = req.user.uid;
    const orders = await OrdersService.getOrdersByBuyer(buyerId);
    return successResponse(res, orders);
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await OrdersService.updateOrderStatus(orderId, status);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
}
