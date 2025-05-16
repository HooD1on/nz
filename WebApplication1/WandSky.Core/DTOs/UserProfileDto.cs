// UserProfileDto.cs
using System.ComponentModel.DataAnnotations;

public class UserProfileDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Bio { get; set; }
    public string ProfileImage { get; set; }
    public UserPreferencesDto Preferences { get; set; }
}

// UpdateProfileDto.cs
public class UpdateProfileDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Bio { get; set; }
    public string ProfileImage { get; set; }
}

// ChangePasswordDto.cs
public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; }

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; }
}

// UserPreferencesDto.cs
public class UserPreferencesDto
{
    public bool Notifications { get; set; }
    public bool Newsletter { get; set; }
    public List<string> TravelPreferences { get; set; } = new List<string>();
}

// UpdatePreferencesDto.cs
public class UpdatePreferencesDto
{
    public bool Notifications { get; set; }
    public bool Newsletter { get; set; }
    public List<string> TravelPreferences { get; set; } = new List<string>();
}