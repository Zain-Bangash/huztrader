# Huz Trader — Website Guide

Welcome! This guide explains how to use the Huz Trader website — both as a visitor browsing cars, and as the admin who manages the inventory.

---

## FOR VISITORS — Browsing the Website

### What can visitors do?

Anyone who visits your website can:

- **Browse all available cars** — one unified list of every vehicle (in-stock and available to order)
- **Enquire about any car** — send you a message about a specific vehicle, regardless of whether it's on the lot or needs to be sourced
- **View recently sold cars** — see what's already found a home
- **Learn about the import service** — understand the process for sourcing a car from Japan
- **Request an import quote** — ask you to source a specific car from Japan
- **Send a general message** — ask any question through the contact page

### How does enquiring work?

When a visitor sees a car they like, they click **"Enquire"** on the car and fill in their name, email, phone, and a message. As soon as they click send:

1. You receive an **email** with all their details
2. They receive a **confirmation email** saying you'll be in touch
3. The enquiry is also saved in your admin panel so you can refer back to it

---

## FOR THE ADMIN — Managing Your Website

You are the admin. Here's everything you can do.

### How to log in

1. Go to your website and add `/admin/login` to the end of the URL
   `https://huztrader.vercel.app/admin/login`
2. Enter your **email** and **password** (the ones you set up in Supabase)
3. Click **Sign In**

You'll land on the **Cars** management page.

---

### How to add a car

1. In the admin panel, click the **"Add Car"** button (top right)
2. Fill in the details:

   **Basic Information**
   - **Make** — the brand, e.g. `Toyota`
   - **Model** — the model name, e.g. `Supra`
   - **Variant** — optional extra detail, e.g. `GR Sport` or `Turbo`
   - **Year** — the manufacture year, e.g. `2020`
   - **Status** — set to `For Sale` for a new listing
   - **Price** — the drive-away price in Australian dollars (numbers only, no $ sign), e.g. `45000`
   - **Mileage** — kilometres on the clock, e.g. `35000`
   - **Stock #** — your own internal reference number, e.g. `S001` (optional)

   **Specifications**
   - Body Type, Transmission, Fuel Type, Colour — select from the dropdown menus
   - VIN — the vehicle identification number (optional)

   **Description**
   - Write anything you want visitors to know — features, condition, service history, etc.

   **Photos**
   - Click the upload area and select one or more photos from your computer
   - The **first photo** becomes the main image shown in listings
   - You can upload multiple photos — they'll appear in a gallery on the car's page
   - To remove a photo, hover over it and click the ✕

3. Click **"Add Car"** to publish it — it appears on the website immediately

---

### How to edit a car

1. Go to **Admin → Cars**
2. Find the car in the list and click the **pencil (edit) icon** on the right
3. Change whatever you need
4. Click **"Save Changes"**

---

### How to mark a car as sold

1. Go to **Admin → Cars**
2. Click the edit icon on the car
3. Change **Status** from `For Sale` to `Sold`
4. Click **"Save Changes"**

The car will:
- **Disappear** from the Cars For Sale page
- **Appear** on the Recently Sold page automatically

---

### How to delete a car

1. Go to **Admin → Cars**
2. Click the **bin (delete) icon** on the right of the car
3. Confirm the deletion

> ⚠️ Deleting is permanent. If you just want to take a car off the market temporarily, change its status to `Reserved` instead.

---

### How to view enquiries

1. Go to **Admin → Enquiries** (click "Enquiries" in the left sidebar)
2. You'll see all messages sent through your website, newest first
3. Each enquiry shows:
   - The visitor's name, email, and phone number
   - Their message
   - Which car they're asking about (if it's a car enquiry)
   - Their budget and location (if it's an import quote request)
4. Click the **email address** to open a reply in your email app

> 💡 You also receive every enquiry by email as soon as it's submitted — you don't need to check this page regularly.
>
> ⚠️ **Email sandbox note:** Until a custom domain is verified in Resend, emails can only be delivered to the address used to sign up for Resend (`zainhuzaifabusiness@gmail.com`). Enquiry confirmation emails to visitors will not send in sandbox mode. To fix: verify a domain in your Resend account and update the `from` address.

---

### How to sign out

Click **"Sign Out"** at the bottom of the left sidebar.

---

## Quick Reference

| Task | Where to go |
|---|---|
| Add a new car (for sale) | Admin → Cars → Add Car button |
| Edit a car's details or photos | Admin → Cars → pencil icon |
| Mark a car as sold | Admin → Cars → edit → change Status to Sold |
| View customer enquiries | Admin → Enquiries |
| Sign out | Bottom of the left sidebar |
| Your website (public view) | Click "View Site" at the bottom of the sidebar |
| Browse all cars (visitor view) | Header → Cars For Sale, or Import A Car → Browse All Cars |

---

## Tips

- **Photos matter** — listings with clear, well-lit photos from multiple angles get far more enquiries. Aim for at least 5–8 photos per car (exterior front/rear/sides, interior, engine bay, any notable features).
- **Prices** — enter numbers only, no dollar signs or commas. `45000` not `$45,000`.
- **Descriptions** — mention service history, any recent work done, RWC status, and whether finance is available. The more detail, the fewer back-and-forth messages.
- **Responding to enquiries** — when you receive an email, just hit reply — your response goes directly to the customer.

---

## Something not working?

Contact the developer and share:
1. What you were trying to do
2. What happened instead
3. A screenshot if possible
