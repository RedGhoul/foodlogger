package com.ava.foodlogger.domain;

import com.ava.foodlogger.domain.enumeration.MealType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FoodEntry.
 */
@Entity
@Table(name = "food_entry")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FoodEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "mealtype")
    private MealType mealtype;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "foodEntries", "user" }, allowSetters = true)
    private FoodDay foodDay;

    @ManyToOne
    @JsonIgnoreProperties(value = { "foodEntries" }, allowSetters = true)
    private Food food;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodEntry id(Long id) {
        this.id = id;
        return this;
    }

    public MealType getMealtype() {
        return this.mealtype;
    }

    public FoodEntry mealtype(MealType mealtype) {
        this.mealtype = mealtype;
        return this;
    }

    public void setMealtype(MealType mealtype) {
        this.mealtype = mealtype;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public FoodEntry createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public FoodDay getFoodDay() {
        return this.foodDay;
    }

    public FoodEntry foodDay(FoodDay foodDay) {
        this.setFoodDay(foodDay);
        return this;
    }

    public void setFoodDay(FoodDay foodDay) {
        this.foodDay = foodDay;
    }

    public Food getFood() {
        return this.food;
    }

    public FoodEntry food(Food food) {
        this.setFood(food);
        return this;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FoodEntry)) {
            return false;
        }
        return id != null && id.equals(((FoodEntry) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FoodEntry{" +
            "id=" + getId() +
            ", mealtype='" + getMealtype() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
