This is a wireframe for a Shopify extension.
There are three distinct users and each sees a different side of the app.

1. Shopper -> Storefront
- This is a b2b shopper that picks things they need that the company will pay for. They spend most of their time in the storefront. They click through products and add them to a cart or quote.
- Storefront-1, storefront-2, storefront-3 are all standard e-comm flows.
- storefront-3-product-detail should have the same product details. There is an additional tab for volume pricing.
- At storefront-3-product-detail, the shopper can add-to-cart or add-to-quote.
- If the shopper clicks add-to-quote, they should advance to customerAdmin-4.1-quote-detail.
- They can go back to the storefront and add more items or edit items in quote.
- The can submit the quote for approval and that completes their flow.

2. Supervisor -> CustomerAdmin
- The Supervisor handles the B2B aspects of the customer-as-business operations. They will want to see new quotes that have been submitted and review multiple quotes. They will either approve quotes, which converts the quotes into invoices, or let them expire. 
- They will also want to handle other data that doesn't change as often, like user management, billing and shipping addresses, etc. 
- They will also want to see deliver statuses and historical information, but they will be addressed later.
- The quotes page should be a table that includes the following columns: 
    - quote date, 
    - quote name, 
    - time till expire, 
    - approval status, 
    - purchase order number, 
    - amount, 
    - approx delivery date, 
    - order ref
    - salesperson
    - integration channel (salsforce, hubspot, etc)
- Clicking on an quote item in a row should bring up a modal window with the specifics of that quote.
- thre should be option to select multiple quotes for approval, edit, reorder.
- They should be able to create a new quote by duplicating an older quote, and be able to change details, like a template.
- if a quote has been approved and converted into an invoice of the order, it that quote should no longer appear in the default table view.

3. Merchant -> Merchant Portal
- the merchant runs the shopify store. These wireframes (not added) are deeply integrated into the Shopify merchant UI. They will want to keep track of companies, their representatives, and related deals.
