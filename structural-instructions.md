look through the instructions and wireframes. This is going to be a react app that uses shopify's latest polaris components.
   
This app is for demo purposes but will probably inform the code in production. Dont overcomplicate the react app. vite is
   probably good. But Remix is too much for now.
I want code that is clean enough and structured well enough so that I can easily expand on it. 
I expect to be able to add items to quote, edit quotes, approve them, etc. 

Look at the examples to see shopify UI. Refer to shopify docs for how to use components and icons. 
For instance: do not use Stck component. it is no longer used. 
Use InnerStack and BlockStack instead. 

The following are suggestions for how I'm thinking about the structure. IT is just a guide.
I prefer shorter focused files than long pages of dom, logic, and data mixed together. 
Typescript is preferred.

- app
    - merchantB2B
    - storeFront
    - customerAdmin

- data objects
    - product inventory
        - product
            - name
            - brand
            - model
            - sku
            - desc
            - dimensions
            - reviews
            - volume pricing
    - product categories
    - store info
        - merchant logo
        - salesperson
    - Shopping cart
        - product
        - amount of product
        - discount
    - Quote
        - name
        - date created
        - date expired
        - amount
        - purchase order number (if available)
        - staus
    - Quote List
        - Quotes
        - Quote data
        - link to quote sheet
    - Inventory
    - Invetory List