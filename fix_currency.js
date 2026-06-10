const fs = require('fs');
const files = ['src/pages/Shop.tsx', 'src/pages/Checkout.tsx', 'src/components/cart/CartDrawer.tsx', 'src/pages/admin/Products.tsx'];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/>\$\{/g, '>৳{');
  content = content.replace(/-\$\{/g, '-৳{');
  content = content.replace(/ \$\{/g, ' ৳{');
  fs.writeFileSync(file, content);
}
