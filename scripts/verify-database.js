// Script to verify database setup
// Run this in your Supabase SQL editor

console.log("=== Database Verification Script ===");

// Check if restaurants table exists
console.log("\n1. Checking if restaurants table exists...");
const restaurantsCheck = `
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'restaurants'
);
`;
console.log(restaurantsCheck);

// Check restaurants table structure
console.log("\n2. Checking restaurants table structure...");
const restaurantsStructure = `
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'restaurants' 
ORDER BY ordinal_position;
`;
console.log(restaurantsStructure);

// Check if required columns exist
console.log("\n3. Checking for required columns...");
const requiredColumns = [
  'id', 'name', 'email', 'subscription_plan', 
  'payment_method', 'status', 'order_limit', 'orders_used'
];

const columnChecks = requiredColumns.map(col => `
SELECT EXISTS (
   SELECT FROM information_schema.columns 
   WHERE table_name = 'restaurants' 
   AND column_name = '${col}'
) AS has_${col};
`).join('\n');
console.log(columnChecks);

// Check if indexes exist
console.log("\n4. Checking for required indexes...");
const indexCheck = `
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'restaurants';
`;
console.log(indexCheck);

console.log("\n=== End of Verification Script ===");