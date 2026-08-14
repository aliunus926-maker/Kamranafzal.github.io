buildCheckoutWhatsAppUrl(customerData) {
  const shipping = window.ShippingEngine 
    ? window.ShippingEngine.calculateShipping(customerData.city, this.cart)
    : { totalShipping: 250, parcelWeightKg: "1.0" };

  const subtotal = this.getCartTotal();
  const grandTotal = subtotal + shipping.totalShipping;

  let msg = `🏔️ *NEW ORDER — KARAKORUM HARVEST*\n`;
  msg += `------------------------------------\n`;
  
  this.cart.forEach((item, index) => {
    const itemTotal = item.linePrice * item.quantity;
    msg += `${index + 1}. *${item.name}* (${item.weightLabel})\n   Qty: ${item.quantity} | Rs. ${itemTotal.toLocaleString()}\n`;
  });

  msg += `------------------------------------\n`;
  msg += `📦 *Est. Weight:* ${shipping.parcelWeightKg} kg\n`;
  msg += `💰 *Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
  msg += `🚚 *Delivery (${shipping.zone}):* Rs. ${shipping.totalShipping.toLocaleString()}\n`;
  msg += `💳 *Grand Total (COD):* Rs. ${grandTotal.toLocaleString()}\n\n`;
  
  msg += `👤 *Customer Details:*\n`;
  msg += `▪ *Name:* ${customerData.name}\n`;
  msg += `▪ *Phone:* ${customerData.phone}\n`;
  msg += `▪ *City:* ${customerData.city}\n`;
  msg += `▪ *Address:* ${customerData.address}\n`;
  if (customerData.notes) {
    msg += `▪ *Notes:* ${customerData.notes}\n`;
  }
  
  msg += `\nPlease confirm order dispatch. JazakAllah khayr!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}