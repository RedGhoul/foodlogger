package com.ava.foodlogger.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Food.
 */
@Entity
@Table(name = "food")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Food implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(min = 2)
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "calories", nullable = false)
    private Float calories;

    @NotNull
    @Column(name = "carbohydrates", nullable = false)
    private Float carbohydrates;

    @NotNull
    @Column(name = "proteins", nullable = false)
    private Float proteins;

    @NotNull
    @Column(name = "fat", nullable = false)
    private Float fat;

    @NotNull
    @Column(name = "sodium", nullable = false)
    private Float sodium;

    @OneToMany(mappedBy = "food")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "foodDay", "food" }, allowSetters = true)
    private Set<FoodEntry> foodEntries = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Food id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Food name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getCalories() {
        return this.calories;
    }

    public Food calories(Float calories) {
        this.calories = calories;
        return this;
    }

    public void setCalories(Float calories) {
        this.calories = calories;
    }

    public Float getCarbohydrates() {
        return this.carbohydrates;
    }

    public Food carbohydrates(Float carbohydrates) {
        this.carbohydrates = carbohydrates;
        return this;
    }

    public void setCarbohydrates(Float carbohydrates) {
        this.carbohydrates = carbohydrates;
    }

    public Float getProteins() {
        return this.proteins;
    }

    public Food proteins(Float proteins) {
        this.proteins = proteins;
        return this;
    }

    public void setProteins(Float proteins) {
        this.proteins = proteins;
    }

    public Float getFat() {
        return this.fat;
    }

    public Food fat(Float fat) {
        this.fat = fat;
        return this;
    }

    public void setFat(Float fat) {
        this.fat = fat;
    }

    public Float getSodium() {
        return this.sodium;
    }

    public Food sodium(Float sodium) {
        this.sodium = sodium;
        return this;
    }

    public void setSodium(Float sodium) {
        this.sodium = sodium;
    }

    public Set<FoodEntry> getFoodEntries() {
        return this.foodEntries;
    }

    public Food foodEntries(Set<FoodEntry> foodEntries) {
        this.setFoodEntries(foodEntries);
        return this;
    }

    public Food addFoodEntry(FoodEntry foodEntry) {
        this.foodEntries.add(foodEntry);
        foodEntry.setFood(this);
        return this;
    }

    public Food removeFoodEntry(FoodEntry foodEntry) {
        this.foodEntries.remove(foodEntry);
        foodEntry.setFood(null);
        return this;
    }

    public void setFoodEntries(Set<FoodEntry> foodEntries) {
        if (this.foodEntries != null) {
            this.foodEntries.forEach(i -> i.setFood(null));
        }
        if (foodEntries != null) {
            foodEntries.forEach(i -> i.setFood(this));
        }
        this.foodEntries = foodEntries;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Food)) {
            return false;
        }
        return id != null && id.equals(((Food) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Food{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", calories=" + getCalories() +
            ", carbohydrates=" + getCarbohydrates() +
            ", proteins=" + getProteins() +
            ", fat=" + getFat() +
            ", sodium=" + getSodium() +
            "}";
    }
}
