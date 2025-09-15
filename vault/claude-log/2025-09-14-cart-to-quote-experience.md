Thinking…

  Perfect! Now I have a comprehensive understanding of the current implementation and the
  wireframe requirements. Let me analyze the B2B workflow and create a plan.

  Analysis of Current vs Intended B2B Cart/Quote Workflow

  Current Implementation Issues:

  1. Cart and Quote are completely separate - The current implementation treats cart and quotes
   as distinct entities with separate stores
  2. Cart acts like B2C checkout - The cart seems designed for immediate payment/checkout
  3. No clear conversion flow - There's no clear path from cart to quote or quote to order
  4. Missing B2B approval workflow - No supervisor approval step in the current flow

  Wireframe Requirements:

  1. Cart as staging area - Cart should be a temporary storage that converts to quotes
  2. Quote approval workflow - Quotes need supervisor approval before becoming orders
  3. Role-based interfaces - Different experiences for shoppers vs supervisors
  4. Company payment context - Company pays, not individual shopper

  Let me create a comprehensive plan for restructuring this B2B workflow.

⏺ Based on my analysis of the wireframes, current implementation, and B2B requirements, I can
   see there's a fundamental mismatch between the current cart/quote system and the intended
  B2B workflow. Let me present a comprehensive plan to restructure this properly.

⏺ User approved Claude's plan:
  ⎿ B2B Cart/Quote Workflow Restructuring Plan

    Current Issues Analysis

    The current implementation treats "cart" and "quote" as separate parallel systems, but
    in B2B, the cart should be a staging area that converts to quotes for approval workflow.

    Standard B2B User Flow (Based on Wireframes)

    1. Shopper adds items → Cart (staging area)
    2. Shopper reviews cart → Convert to Quote
    3. Shopper submits quote → Supervisor approval workflow
    4. Supervisor approves → Order/Invoice (company pays)
    5. Order fulfillment → Delivery tracking

    Proposed Restructuring

    1. Redefine Cart Purpose

    - Current: B2C-style checkout cart
    - New: B2B staging area for quote building
    - Remove "checkout" concept entirely
    - Add "Request Quote" as primary CTA

    2. Unified Cart-to-Quote Flow

    - Cart becomes temporary quote storage
    - "Add to Cart" → staging for quote
    - "Add to Quote" → same action (remove distinction)
    - Cart page becomes "Quote Builder"

    3. Quote States & Workflow

    - Draft: Items in cart (shopper can edit)
    - Submitted: Sent for approval (shopper can view, no edit)
    - Approved: Converted to order (company purchase)
    - Rejected: Back to draft (shopper can revise)
    - Expired: Auto-expire after X days

    4. Component Changes Needed

    A. Cart/Quote Builder Component

    - Rename "Shopping Cart" → "Quote Builder"
    - Replace "Checkout" button → "Submit for Approval"
    - Add quote metadata fields (PO number, delivery date, notes)
    - Show company billing context

    B. Supervisor Quote Management

    - Enhanced CustomerQuotes with approval workflow
    - Bulk approval capabilities
    - Quote modification permissions
    - Integration with company billing

    C. Navigation & Affordances

    - Cart icon shows "pending quote items"
    - Clear distinction between "Draft" and "Submitted" states
    - Status indicators throughout UI

    5. Data Model Updates

    - Merge cart and quote item structures
    - Add approval workflow states
    - Include company/billing context
    - Track approval history

    6. Delivery Status Integration

    - Post-approval order tracking
    - Delivery date estimates
    - Status updates for supervisors

    Implementation Priority

    1. Phase 1: Restructure cart as quote builder
    2. Phase 2: Implement approval workflow
    3. Phase 3: Add delivery tracking
    4. Phase 4: Enhanced supervisor tools

    This approach aligns with standard B2B procurement workflows where employees build
    requests that require organizational approval before purchase.


✻ Thinking…

  Great! The user has approved the plan. Now I need to start implementing the B2B cart/quote
  workflow restructuring. Let me start by updating the todo list to track this work, then begin
   with Phase 1 - restructuring the cart as a quote builder.

  I should start with:
  1. Update todo list for this work
  2. Begin Phase 1: Restructure cart as quote builder
    - Update the cart store to be more quote-focused
    - Rename and update the ShoppingCart component to be a QuoteBuilder
    - Update the navigation and affordances
    - Remove checkout concepts, add quote submission

  Let me start by setting up the todo list.

✻ Thinking…

  Now let me start with Phase 1. First, I'll examine the current data models and types to
  understand what needs to be updated. Let me look at the types first.

⏺ Read(src/shared/types/index.ts)
  ⎿  Read 100 lines (ctrl+o to expand)

✻ Thinking…

  Perfect! I can see the current type structure. I notice that:

  1. CartItem and QuoteItem are very similar but slightly different
  2. Quote already has a good structure with states ('draft', 'pending', 'approved', 'expired',
   'rejected')
  3. The ShoppingCart interface seems more like a traditional cart

  For Phase 1, I should:
  1. First update the cart store to be more quote-focused
  2. Merge the cart and quote item concepts
  3. Update the cart store to handle quote metadata

  Let me start by updating the cart store to be more quote-focused.
