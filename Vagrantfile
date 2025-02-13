Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = "1024"
    vb.cpus = 1

    # Disable audio
    vb.customize ["modifyvm", :id, "--audio", "none"]
  end

  # Gateway VM
  config.vm.define "gateway-vm" do |gateway|
    gateway.vm.network "forwarded_port", guest: 8000, host: 8000
    gateway.vm.network "private_network", ip: "192.168.56.10"
    
    gateway.vm.synced_folder "src/api-gateway", "/home/vagrant/api-gateway"
    gateway.vm.synced_folder "scripts", "/home/vagrant/scripts"
    gateway.vm.synced_folder ".", "/home/vagrant/root", exclude: ["src", "scripts", "images"]
    
    gateway.vm.provision "shell", path: "scripts/gateway-app/setup-gateway.sh"
    
    gateway.vm.post_up_message = "Gateway VM started successfully!"
    gateway.vm.boot_timeout = 600
  end

  # Inventory VM
  config.vm.define "inventory-vm" do |inventory|
    inventory.vm.network "forwarded_port", guest: 8080, host: 8080
    inventory.vm.network "private_network", ip: "192.168.56.11"

    inventory.vm.synced_folder "src/inventory-app", "/home/vagrant/inventory-app"
    inventory.vm.synced_folder "scripts", "/home/vagrant/scripts"
    inventory.vm.synced_folder ".", "/home/vagrant/root", exclude: ["src", "scripts", "images"]

    inventory.vm.provision "shell", path: "scripts/inventory-app/setup-inventory.sh"

    inventory.vm.post_up_message = "Inventory VM started successfully!"
    inventory.vm.boot_timeout = 600
  end

  # Billing VM
  config.vm.define "billing-vm" do |billing|
    # Network configuration
    billing.vm.network "forwarded_port", guest: 8081, host: 8081
    billing.vm.network "private_network", ip: "192.168.56.12"
    
    billing.vm.synced_folder ".", "/home/vagrant/app"

    # Provisioning
    billing.vm.provision "shell", path: "scripts/billing-app/setup-billing.sh"  
    billing.vm.post_up_message = "Billing VM started successfully!"

    billing.vm.boot_timeout = 600
  end
  
  config.vm.post_up_message = "All 3 virtual machines started successfully! If you see errors, manually check VirtualBox."
end