package realestate.backend.Service;

import realestate.backend.Dto.PropertyDTO;
import realestate.backend.Entity.Property;
import realestate.backend.Entity.User;
import realestate.backend.Repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public Property createProperty(PropertyDTO dto, User owner) {
        Property property = Property.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .surface(dto.getSurface())
                .rooms(dto.getRooms())
                .location(dto.getLocation())
                .district(dto.getDistrict())
                .age(dto.getAge())
                .imageUrl(dto.getImageUrl())
                .propertyType(dto.getPropertyType())
                .status(dto.getStatus())
                .owner(owner)
                .build();

        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public List<Property> getPropertiesByOwner(User owner) {
        return propertyRepository.findByOwner(owner);
    }

    public Property updateProperty(Long id, PropertyDTO dto, User currentUser) {
        Property property = getPropertyById(id);

        if (!property.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not the owner of this property");
        }

        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setPrice(dto.getPrice());
        property.setSurface(dto.getSurface());
        property.setRooms(dto.getRooms());
        property.setLocation(dto.getLocation());
        property.setDistrict(dto.getDistrict());
        property.setAge(dto.getAge());
        property.setImageUrl(dto.getImageUrl());
        property.setPropertyType(dto.getPropertyType());
        property.setStatus(dto.getStatus());

        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id, User currentUser) {
        Property property = getPropertyById(id);

        if (!property.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not the owner of this property");
        }

        propertyRepository.delete(property);
    }

    public List<Property> getPropertiesByDistrict(String district) {
        return propertyRepository.findByDistrict(district);
    }

    public List<Property> getPropertiesByPriceRange(Double min, Double max) {
        return propertyRepository.findByPriceBetween(min, max);
    }
}