<?php

namespace Tests\Unit\Services;

use App\Models\Setting;
use App\Models\User;
use App\Services\UserSettingsResolver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserSettingsResolverTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_settings_with_defaults_when_none_exist(): void
    {
        $user = User::factory()->create();
        $resolver = new UserSettingsResolver();

        $settings = $resolver->forUser($user);

        $this->assertDatabaseHas('settings', ['user_id' => $user->id]);
        $this->assertEquals(Setting::defaults()['kwh_price'], (float) $settings->kwh_price);
        $this->assertEquals(Setting::defaults()['hours_per_year'], $settings->hours_per_year);
    }

    public function test_it_returns_the_existing_settings_on_subsequent_calls(): void
    {
        $user = User::factory()->create();
        $resolver = new UserSettingsResolver();

        $first = $resolver->forUser($user);
        $first->update(['kwh_price' => 1.23]);

        $second = $resolver->forUser($user->fresh());

        $this->assertSame($first->id, $second->id);
        $this->assertEquals(1.23, (float) $second->kwh_price);
        $this->assertSame(1, Setting::where('user_id', $user->id)->count());
    }
}
