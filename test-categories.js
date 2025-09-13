// Quick test to verify category uniqueness
import { generateSeedData } from './src/data/mock/seed.ts';

console.log('Testing category generation...');
const data = generateSeedData();

console.log('\nGenerated categories:');
data.categories.forEach((cat, index) => {
  console.log(`${index + 1}. ${cat.name} (ID: ${cat.id})`);
});

// Check for duplicates
const categoryNames = data.categories.map(cat => cat.name);
const uniqueNames = [...new Set(categoryNames)];

console.log(`\nTotal categories: ${categoryNames.length}`);
console.log(`Unique category names: ${uniqueNames.length}`);

if (categoryNames.length === uniqueNames.length) {
  console.log('✅ SUCCESS: No duplicate category names found!');
} else {
  console.log('❌ ISSUE: Duplicate category names detected');
  const duplicates = categoryNames.filter((name, index) => categoryNames.indexOf(name) !== index);
  console.log('Duplicates:', [...new Set(duplicates)]);
}