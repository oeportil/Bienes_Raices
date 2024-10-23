-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealState" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rlst_url" TEXT,
    "amenitieId" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "RealState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenitie" (
    "id" SERIAL NOT NULL,
    "wc" INTEGER NOT NULL,
    "dimension" DECIMAL(65,30) NOT NULL,
    "parking" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL,
    "gardens" INTEGER NOT NULL,

    CONSTRAINT "Amenitie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealStateImages" (
    "id" SERIAL NOT NULL,
    "img_url" TEXT NOT NULL,
    "real_state_id" INTEGER NOT NULL,

    CONSTRAINT "RealStateImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RealState_user_id_key" ON "RealState"("user_id");

-- AddForeignKey
ALTER TABLE "RealState" ADD CONSTRAINT "RealState_amenitieId_fkey" FOREIGN KEY ("amenitieId") REFERENCES "Amenitie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealState" ADD CONSTRAINT "RealState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealStateImages" ADD CONSTRAINT "RealStateImages_real_state_id_fkey" FOREIGN KEY ("real_state_id") REFERENCES "RealState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
