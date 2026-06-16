export const brandsWithProductsQuery = `
  *[_type == "brand"] | order(sortOrder asc, name asc) {
    _id,
    name,
    slug,
    logo,
    heroImage,
    region,
    shortDescription,
    description,
    "products": *[_type == "product" && references(^._id)] | order(sortOrder asc, name asc) {
      _id,
      name,
      category,
      packSize,
      shortDescription,
      features
    }
  }
`;

export const aboutPageQuery = `
  *[_type == "aboutPage"][0] {
    headline,
    intro,
    quote,
    portrait
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    companyName,
    heroTitle,
    heroText,
    contactEmail,
    phone,
    address
  }
`;