-- CreateEnum
CREATE TYPE "agent_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "agents" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_call" VARCHAR(20),
    "phone_whatsapp" VARCHAR(20),
    "bio" TEXT,
    "profile_picture" VARCHAR(2048),
    "slug" VARCHAR(255),
    "status" "agent_status" NOT NULL DEFAULT 'pending',
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firebase_uid" VARCHAR(128) NOT NULL,
    "title" TEXT,
    "experience" INTEGER,
    "specializations" TEXT[],
    "areasServed" TEXT[],

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" VARCHAR(255),
    "tags" TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "excerpt" TEXT,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "description" TEXT NOT NULL,
    "property_type" VARCHAR(20) DEFAULT 'other',
    "listing_type" VARCHAR(20) DEFAULT 'sale',
    "location" VARCHAR(255) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "price" INTEGER,
    "currency" VARCHAR(20) DEFAULT 'GH₵',
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" VARCHAR(100),
    "area_unit" VARCHAR(20) DEFAULT 'sqft',
    "featured_image_url" VARCHAR(2048),
    "image_urls" JSONB DEFAULT '[]',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) DEFAULT 'available',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" UUID,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenities" (
    "property_id" UUID NOT NULL,
    "amenity_id" INTEGER NOT NULL,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("property_id","amenity_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_email_key" ON "agents"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agents_slug_key" ON "agents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "agents_firebase_uid_key" ON "agents"("firebase_uid");

-- CreateIndex
CREATE INDEX "idx_agent_email" ON "agents"("email");

-- CreateIndex
CREATE INDEX "idx_agent_firebase_uid" ON "agents"("firebase_uid");

-- CreateIndex
CREATE INDEX "idx_agent_slug" ON "agents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- CreateIndex
CREATE INDEX "idx_amenity_name" ON "amenities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "idx_blog_posts_slug" ON "blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "idx_is_featured" ON "properties"("is_featured");

-- CreateIndex
CREATE INDEX "idx_listing_type" ON "properties"("listing_type");

-- CreateIndex
CREATE INDEX "idx_location" ON "properties"("location");

-- CreateIndex
CREATE INDEX "idx_price" ON "properties"("price");

-- CreateIndex
CREATE INDEX "idx_property_type" ON "properties"("property_type");

-- CreateIndex
CREATE INDEX "idx_region" ON "properties"("region");

-- CreateIndex
CREATE INDEX "idx_status" ON "properties"("status");

-- CreateIndex
CREATE INDEX "idx_property_amenity_amenity_id" ON "property_amenities"("amenity_id");

-- CreateIndex
CREATE INDEX "idx_property_amenity_property_id" ON "property_amenities"("property_id");

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "property_amenities" ADD CONSTRAINT "property_amenities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
