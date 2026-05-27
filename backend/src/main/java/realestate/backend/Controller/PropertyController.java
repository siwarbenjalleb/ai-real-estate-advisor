package realestate.backend.Controller;



import realestate.backend.Dto.PropertyDTO;
import realestate.backend.Entity.Property;
import realestate.backend.Entity.User;
import realestate.backend.Service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<Property> createProperty(
            @RequestBody PropertyDTO dto,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(propertyService.createProperty(dto, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/my-properties")
    public ResponseEntity<List<Property>> getMyProperties(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyDTO dto,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        propertyService.deleteProperty(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/district/{district}")
    public ResponseEntity<List<Property>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(propertyService.getPropertiesByDistrict(district));
    }

    @GetMapping("/search/price")
    public ResponseEntity<List<Property>> getByPriceRange(
            @RequestParam Double min,
            @RequestParam Double max) {
        return ResponseEntity.ok(propertyService.getPropertiesByPriceRange(min, max));
    }
}
