import {
  findBrandBySlug,
  findModelBySlug,
  findTechnical,
  findCompatibilities,
  findMarketplaceParts,
  findMasterPartsByIds,
  findBrandsByIds,
  findCategoriesByIds,
} from "../repositories/search.repository.js";

function normalize(text) {
  return text?.toString().toLowerCase().trim();
}

export async function executeSearch(data) {

  // Normalização completa
  const brandSlug = normalize(data.brand);
  const modelSlug = normalize(data.model);
  const engine = normalize(data.engineDisplacement);
  const fuel = normalize(data.fuelType);

  // 1️⃣ Brand
  const brand = await findBrandBySlug(brandSlug);
  if (!brand) return { data: [], pagination: { hasMore: false } };

  // 2️⃣ Model
  const model = await findModelBySlug(modelSlug, brand.id);
  if (!model) return { data: [], pagination: { hasMore: false } };

  // 3️⃣ Technical
  const technical = await findTechnical(
    brand.id,
    model.id,
    engine,
    fuel
  );
  if (!technical) return { data: [], pagination: { hasMore: false } };

  // 4️⃣ Compatibilities
  const masterPartIds = await findCompatibilities(technical.id);


  if (!masterPartIds.length)
    return { data: [], pagination: { hasMore: false } };

  // 5️⃣ Marketplace Parts
  const marketplaceResult = await findMarketplaceParts({
    masterPartIds,
    limit: data.limit,
    lastDocId: data.lastDocId,
    orderBy: data.orderBy,
    orderDirection: data.orderDirection,
    minStock: data.minStock,
    condition: data.condition,
    minWarranty: data.minWarranty,
  });


  if (!marketplaceResult.data.length)
    return { data: [], pagination: marketplaceResult.pagination };

  // 6️⃣ Buscar MasterParts
  const masterParts = await findMasterPartsByIds(
    marketplaceResult.data.map((p) => p.masterPartId)
  );

  // 7️⃣ Buscar Brands e Categories relacionadas
  const brands = await findBrandsByIds(
    masterParts.map((p) => p.brandId).filter(Boolean)
  );

  const categories = await findCategoriesByIds(
    masterParts.map((p) => p.categoryId).filter(Boolean)
  );

  // 8️⃣ Enriquecer resultado
  const enrichedData = marketplaceResult.data.map((item) => {
    const part = masterParts.find((mp) => mp.id === item.masterPartId);

    const partBrand = brands.find((b) => b.id === part?.brandId);
    const partCategory = categories.find((c) => c.id === part?.categoryId);

    return {
      ...item,
      part: {
        id: part?.id || null,
        name: part?.name || null,
        oemNumber: part?.oemNumber || null,
        description: part?.description || null,
        images: part?.images || [],
        weightKg: part?.weightKg || 0,
        dimensions: part?.dimensions || null,
        brand: partBrand?.name || null,
        category: partCategory?.name || null,
      },
    };
  });

  return {
    data: enrichedData,
    pagination: marketplaceResult.pagination,
  };
}