import { FC } from "react";

interface PropertyCardProps {
  property: RealState; // Define aquí el tipo de propiedad
  onEdit: (property: RealState) => void;
  onDelete: (id: number) => void;
}

const PropertyCard: FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card w-64 bg-base-100 shadow-xl m-4">
      <figure>
        <img
          src={property.images[0]?.img_url || "/default.jpg"}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{property.name}</h2>
        <p>{property.description}</p>
        <p className="text-xl font-bold text-secondary">
          ${property.price.toFixed(2)}
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={() => onEdit(property)}>
            Editar
          </button>
          <button
            className="btn btn-error"
            onClick={() => onDelete(property.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
