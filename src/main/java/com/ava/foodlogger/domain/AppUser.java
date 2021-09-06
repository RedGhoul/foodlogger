package com.ava.foodlogger.domain;

import com.ava.foodlogger.domain.enumeration.ActivityLevel;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A AppUser.
 */
@Entity
@Table(name = "app_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AppUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "bio")
    private String bio;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @NotNull
    @Column(name = "height", nullable = false)
    private Float height;

    @Column(name = "workouts_per_week")
    private Integer workoutsPerWeek;

    @Column(name = "minutes_per_workout")
    private Integer minutesPerWorkout;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_level")
    private ActivityLevel activityLevel;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUser id(Long id) {
        this.id = id;
        return this;
    }

    public String getBio() {
        return this.bio;
    }

    public AppUser bio(String bio) {
        this.bio = bio;
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public LocalDate getCreatedDate() {
        return this.createdDate;
    }

    public AppUser createdDate(LocalDate createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Float getHeight() {
        return this.height;
    }

    public AppUser height(Float height) {
        this.height = height;
        return this;
    }

    public void setHeight(Float height) {
        this.height = height;
    }

    public Integer getWorkoutsPerWeek() {
        return this.workoutsPerWeek;
    }

    public AppUser workoutsPerWeek(Integer workoutsPerWeek) {
        this.workoutsPerWeek = workoutsPerWeek;
        return this;
    }

    public void setWorkoutsPerWeek(Integer workoutsPerWeek) {
        this.workoutsPerWeek = workoutsPerWeek;
    }

    public Integer getMinutesPerWorkout() {
        return this.minutesPerWorkout;
    }

    public AppUser minutesPerWorkout(Integer minutesPerWorkout) {
        this.minutesPerWorkout = minutesPerWorkout;
        return this;
    }

    public void setMinutesPerWorkout(Integer minutesPerWorkout) {
        this.minutesPerWorkout = minutesPerWorkout;
    }

    public LocalDate getDateOfBirth() {
        return this.dateOfBirth;
    }

    public AppUser dateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
        return this;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public ActivityLevel getActivityLevel() {
        return this.activityLevel;
    }

    public AppUser activityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
        return this;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public User getUser() {
        return this.user;
    }

    public AppUser user(User user) {
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
        if (!(o instanceof AppUser)) {
            return false;
        }
        return id != null && id.equals(((AppUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUser{" +
            "id=" + getId() +
            ", bio='" + getBio() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", height=" + getHeight() +
            ", workoutsPerWeek=" + getWorkoutsPerWeek() +
            ", minutesPerWorkout=" + getMinutesPerWorkout() +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            ", activityLevel='" + getActivityLevel() + "'" +
            "}";
    }
}
