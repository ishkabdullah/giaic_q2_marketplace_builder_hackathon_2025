# **Day 6 \- Deployment Preparation and Staging Environment \- LuxeWalk**

---

## **1\. Overview**

This document provides a detailed summary of the deployment preparation and staging environment setup for LuxeWalk, along with performance optimizations, testing reports, and final deployment checks to ensure a smooth transition to the production environment.

---

## **2\. Deployment Preparation**

### **2.1 Key Deployment Steps**

1. **Environment Configuration:**

   - Created `.env` files to store sensitive credentials (API keys, URIs, etc.).
   - Ensured all environment-specific variables are properly managed.

2. **Build Optimization:**

   - Generated a production build using the `next build` for performance improvements.

3. **Hosting and Deployment Service:**

   - Selected **Vercel** for hosting due to its seamless Next.js integration.
   - Connected the GitHub repository to enable continuous deployment on each push to the `main` branch.

4. **Database Connection:**

   - Configured the **Sanity CMS** backend for staging and production environments with different datasets.
   - Verified secure and efficient database access with proper CORS settings.

5. **Image Optimization:**
   - Compressed all images using Next.js `next/image` component.
   - Enabled lazy loading for non-critical images to improve initial page load time.

---

## **3\. Staging Environment**

### **3.1 Purpose of Staging Environment**

- To test the application in a live-like environment before deploying to production.
- To identify and fix any potential issues related to hosting, performance, or compatibility.

### **3.2 Setup**

1. **Domain:**

   - Deployed a staging version of the application on `https://dec-hackathon.vercel.app`

2. **Staging Data:**
   - Populated the staging database with sample data for categories, products, and user information.

---

## **4\. Performance Report**

### **4.1 Lighthouse Performance Metrics**

The following performance metrics were recorded using **Google Lighthouse**:

| Metric         | Score   |
| :------------- | :------ |
| Performance    | 95/100  |
| Accessibility  | 98/100  |
| Best Practices | 100/100 |
| SEO            | 100/100 |

---

## **5\. Testing Report**

### **5.1 Summary of Test Cases**

A total of **8 test cases** were executed, covering critical functionalities such as user authentication, dynamic routing, and checkout flow.

| Test Case ID | Test Case Title          | Expected Result                                                                                             | Actual Result | Remarks                                                                |
| :----------- | :----------------------- | :---------------------------------------------------------------------------------------------------------- | :------------ | :--------------------------------------------------------------------- |
| TC-001       | Search Bar Functionality | Products matching the search query are displayed. User-friendly message appears if no matches are found.    | Pass          | \-                                                                     |
| TC-002       | Filter Component         | Products are filtered correctly based on the selected criteria.                                             | Fail          | some filters are working fine but color and size filter can be improve |
| TC-003       | Checkout Validation      | User is prompted to fill out the required form if details are incomplete. Order is placed upon valid input. | Pass          | \-                                                                     |
| TC-004       | Dynamic Routing          | Dynamic product page loads correctly with product-specific data.                                            | Pass          | \-                                                                     |
| TC-005       | Authentication Dashboard | Dashboard displays the order details (e.g., active, pending, completed orders).                             | Pass          | \-                                                                     |
| TC-006       | write review             | It will get user input and show in UI after submition                                                       | Fail          | it accepts input correctly and show it in UI but not correctly         |
| TC-007       | Api test                 | It will show fallback error message                                                                         | Pass          | \-                                                                     |
| TC-008       | Enshure responsiveness   | It should be responsive on all screens                                                                      | Pass          | \-                                                                     |

---

## **6\. Security Measures**

1. **Input Validation:**

   - All user inputs are sanitized to prevent SQL injection or XSS attacks.

2. **API Security:**

   - Secured API endpoints.
   - Ensured API keys and secrets are stored in environment variables and never exposed in the frontend.

3. **HTTPS:**

   - Enabled HTTPS for secure communication between the client and server.

4. **CORS Configuration:**
   - Configured CORS policies to allow only trusted domains to access backend APIs.

---

## **9\. Final Checklist for Deployment**

- [x] Verified production build with `next build`.
- [x] Tested all critical functionalities in the staging environment.
- [x] Ensured all sensitive information is securely stored.
- [x] Configured proper error monitoring and analytics.
- [x] Deployed staging build to **Vercel** for final review.
