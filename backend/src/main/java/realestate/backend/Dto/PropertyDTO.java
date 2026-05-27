package realestate.backend.Dto;

import realestate.backend.Entity.PropertyStatus;
import realestate.backend.Entity.PropertyType;
import lombok.Data;

@Data
public class PropertyDTO {
    private String title;
    private String description;
    private Double price;
    private Double surface;
    private Integer rooms;
    private String location;
    private String district;
    private Integer age;
    private String imageUrl;
    private PropertyType propertyType;
    private PropertyStatus status;
}
