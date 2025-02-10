import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Category from '../../../models/Category';

export async function GET(request) {
  try {
    await connectDB();
    console.log('GET /api/categories - MongoDB bağlantısı başarılı');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Eğer id parametresi varsa, tek bir kategori getir
    if (id) {
      const category = await Category.findById(id).lean();
      if (!category) {
        console.log('GET /api/categories - Kategori bulunamadı:', id);
        return NextResponse.json(
          { error: 'Kategori bulunamadı' },
          { status: 404 }
        );
      }
      console.log('GET /api/categories - Kategori bulundu:', category);
      return NextResponse.json(category);
    }

    // Tüm aktif kategorileri getir
    const categories = await Category.find({ status: true })
      .sort({ order: 1, name: 1 })
      .lean();

    console.log('GET /api/categories - Kategoriler bulundu:', categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories - Hata:', error);
    return NextResponse.json(
      { error: 'Kategoriler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('POST /api/categories - Gelen veri:', body);

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Kategori adı zorunludur' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('POST /api/categories - MongoDB bağlantısı başarılı');

    // Slug oluştur
    const slug = body.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Aynı isimde veya slug'da kategori var mı kontrol et
    const existingCategory = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } },
        { slug: slug }
      ]
    });

    if (existingCategory) {
      console.log('POST /api/categories - Kategori zaten var:', existingCategory);
      return NextResponse.json(
        { error: 'Bu isimde bir kategori zaten var' },
        { status: 400 }
      );
    }

    // Son sıra numarasını bul
    const lastCategory = await Category.findOne({})
      .sort({ order: -1 })
      .select('order')
      .lean();
    
    const nextOrder = (lastCategory?.order || -1) + 1;

    // Yeni kategori oluştur
    const category = await Category.create({
      name: body.name.trim(),
      slug: slug,
      description: body.description?.trim() || '',
      order: nextOrder,
      status: true
    });

    console.log('POST /api/categories - Kategori oluşturuldu:', category);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories - Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Kategori eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID\'si gerekli' },
        { status: 400 }
      );
    }

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Kategori adı zorunludur' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('PUT /api/categories - MongoDB bağlantısı başarılı');

    // Önce kategoriyi bul
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      console.log('PUT /api/categories - Kategori bulunamadı:', id);
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Slug oluştur
    const slug = body.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Aynı isimde veya slug'da başka kategori var mı kontrol et (kendisi hariç)
    const duplicateCategory = await Category.findOne({
      _id: { $ne: id },
      $or: [
        { name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } },
        { slug: slug }
      ]
    });

    if (duplicateCategory) {
      console.log('PUT /api/categories - Kategori zaten var:', duplicateCategory);
      return NextResponse.json(
        { error: 'Bu isimde bir kategori zaten var' },
        { status: 400 }
      );
    }

    // Kategoriyi güncelle
    existingCategory.name = body.name.trim();
    existingCategory.slug = slug;
    existingCategory.description = body.description?.trim() || '';

    await existingCategory.save();

    console.log('PUT /api/categories - Kategori güncellendi:', existingCategory);
    return NextResponse.json(existingCategory);
  } catch (error) {
    console.error('PUT /api/categories - Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Kategori güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID\'si gerekli' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('DELETE /api/categories - MongoDB bağlantısı başarılı');

    const category = await Category.findById(id);
     if(!category) {
      console.log('DELETE /api/categories - Kategori bulunamadı:', id);
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    await category.deleteOne();
    console.log('DELETE /api/categories - Kategori silindi:', id);

    return NextResponse.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('DELETE /api/categories - Hata:', error);
    return NextResponse.json(
      { error: error.message || 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
