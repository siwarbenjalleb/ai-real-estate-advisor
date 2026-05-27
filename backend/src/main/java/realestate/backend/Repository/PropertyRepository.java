package realestate.backend.Repository;

import realestate.backend.Entity.Property;
import realestate.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwner(User owner);
    List<Property> findByDistrict(String district);
    List<Property> findByPriceBetween(Double min, Double max);
}