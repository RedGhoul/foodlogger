package com.ava.foodlogger.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CurrentWeight.
 */
@Entity
@Table(name = "current_weight")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CurrentWeight implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "weight", nullable = false)
    private Float weight;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CurrentWeight id(Long id) {
        this.id = id;
        return this;
    }

    public Float getWeight() {
        return this.weight;
    }

    public CurrentWeight weight(Float weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public CurrentWeight createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public User getUser() {
        return this.user;
    }

    public CurrentWeight user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CurrentWeight)) {
            return false;
        }
        return id != null && id.equals(((CurrentWeight) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CurrentWeight{" +
            "id=" + getId() +
            ", weight=" + getWeight() +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
