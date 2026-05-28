package realestate.backend.Repository;



import realestate.backend.Entity.Prediction;
import realestate.backend.Entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    Optional<Prediction> findByProperty(Property property);
}